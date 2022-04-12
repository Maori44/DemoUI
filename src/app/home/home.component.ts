import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  tollForm: FormGroup;
  details: any;
  constructor(private appService: AppService, private route: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('login')) {
      this.route.navigate(['/login']);
    } else {
      this.initForm();
      this.getData();
    }
  }

  initForm() {
    this.tollForm = new FormGroup({
      carNumber: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      toll: new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    const model = {
      carNumber: this.tollForm.value.carNumber,
      date: this.tollForm.value.date,
      toll: this.tollForm.value.toll.toString(),
    };
    this.appService.addData(model).subscribe((finalData) => {
      if (finalData) {
        this.getData();
        this.tollForm.reset();
      }
    });
  }

  getData() {
    this.appService.getData().subscribe((data) => {
      if (data) {
        this.details = data;
      }
    });
  }

  deleteData(id) {
    this.appService.removeData(id).subscribe((data) => {
      if (data) {
        this.getData();
      }
    });
  }

  logout() {
    this.route.navigate(['/login']);
    if (localStorage.getItem('login')) {
      localStorage.clear();
    }
  }
}
