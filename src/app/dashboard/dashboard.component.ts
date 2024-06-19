import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddPatientComponent } from './add-patient/add-patient.component';

import { ApiService } from '../common/services/api/api.service';
import { Medicine, SearchMedicinesResponse } from '../common/interfaces/patient.interface';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  displayColumns: string[] = ['medicinename', 'price', 'packing_size', 'mobile', 'action'];
 

    @ViewChild(MatSort) sort!: MatSort;
    medicines: Medicine[] = [];
    medicine_name: string = '';

    constructor(public dialog: MatDialog, private router: Router, public apiService: ApiService) { }

    ngOnInit(): void {
    }

    openDialog(medicine_id?: string) {
      this.dialog.open(AddPatientComponent, {
          data: {
              medicine_id
          },
      });
  }

    onSearch(): void {
        this.apiService.searchMedicines(this.medicine_name).subscribe({
          next: (data: SearchMedicinesResponse) => {
            if (data.status_code === "0") {
                console.log('api respone',data.data.result);
            } else {
              if (data.status_code === "1") {
                console.log('api respone',data);
            }   
              this.medicines = data.data.result; // Assuming the API returns an array of medicines
            }
          },
          error: (error) => {
            console.error('Error:', error);
            alert('Error: ' + error.error.status_message); // Displaying error message to user
          }
        });
      }
      redirect(medicine_id: string): void {
        this.router.navigate(['dashboard/checkout'], { queryParams: {medicine_id}})
    }
}
