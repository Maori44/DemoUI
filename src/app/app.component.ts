import {
  Component,
  ViewChild,
  TemplateRef,
  ElementRef,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AppService } from './app.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  title = 'angular-idle-timeout';
  closeResult: string;
  modalReference: NgbModalRef;

  @ViewChild('mymodal') mymodal: ElementRef;

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private appService: AppService,
    private modalService: NgbModal
  ) {
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(500);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(250);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      console.log(this.idleState);
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.getDismissReason('close');
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log(this.idleState);
      this.router.navigate(['/']);
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = "You've gone idle!";
      console.log(this.idleState);
      this.open(this.mymodal);
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      console.log(this.idleState);
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.appService.getUserLoggedIn().subscribe((userLoggedIn) => {
      if (userLoggedIn) {
        idle.watch();
        this.timedOut = false;
      } else {
        idle.stop();
      }
    });

    // this.reset();
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  reset() {
    this.idle.watch();
    //xthis.idleState = 'Started.';
    this.timedOut = false;
  }

  hideChildModal(): void {
   this.getDismissReason(ModalDismissReasons.ESC);
  }

  stay() {
    this.getDismissReason(ModalDismissReasons.ESC);
    this.reset();
  }

  logout() {
    this.getDismissReason(ModalDismissReasons.ESC);
    this.appService.setUserLoggedIn(false);
    this.router.navigate(['/']);
  }

  ngOnInit() {}
}
