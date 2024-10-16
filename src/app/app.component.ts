import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tip-calc';

  selectedTipPercentage: number = 0;
  tipPercentages = [5, 10, 15, 25, 50];
  tipPerPerson: number;
  totalPerPerson: number;

  customTip: number = 0;
  invalid: boolean;
  showCustomTipInput: boolean | undefined = false;
  tip: number | undefined;
  tipForm = new FormGroup({
    billAmount: new FormControl('', [Validators.required, Validators.min(1)]),
    customTipPercentage: new FormControl('', [Validators.required, Validators.min(1)]),
    noOfPeople: new FormControl('', [Validators.required, Validators.min(1)]),
  });
  invalidCustom: boolean | undefined;

  constructor() {
    this.invalid = false;
    this.invalidCustom = false;
    this.tipPerPerson = 0;
    this.totalPerPerson = 0;
    this.tipForm.valueChanges.subscribe((value) => {
      if (value.customTipPercentage) {
        this.onCustomTipChange(value.customTipPercentage);
      }
    });

    this.tipForm.get('billAmount')?.valueChanges.subscribe((value) => {
      if (this.selectedTipPercentage > 0) {
        this.calculateTipAndTotal(this.selectedTipPercentage)
      }
    });
    this.tipForm.get('noOfPeople')?.valueChanges.subscribe((value) => {
      if (this.selectedTipPercentage > 0) {
        this.calculateTipAndTotal(this.selectedTipPercentage)
      }
    });
  }

  calculateTipAndTotal(tip: number) {
    this.selectedTipPercentage = tip;
    this.showCustomTipInput = false;
    this.tipForm.get('customTipPercentage')?.reset();
    this.tipForm.get('customTipPercentage')?.disable();

    if (this.tipForm.valid) {
      this.invalid = false;
      const bill = Number(this.tipForm.get('billAmount')?.value);
      const people = Number(this.tipForm.get('noOfPeople')?.value);

      this.invalid = false;
      const tipPerPerson = (bill * (tip / 100)) / people;
      this.tipPerPerson = tipPerPerson;
      this.totalPerPerson = bill / people + tipPerPerson;
    } else {
      this.invalid = true;
    }
  }

  onCustomTipChange(value: any) {
    const tipValue = Number(value) || 0;
    const bill = Number(this.tipForm.get('billAmount')?.value);
    const people = Number(this.tipForm.get('noOfPeople')?.value);
    if (this.tipForm.valid) {
      this.invalidCustom = false;
      this.customTip = tipValue;
      this.tipPerPerson = (bill * (tipValue / 100)) / people;
      this.totalPerPerson = bill / people + this.tipPerPerson;
    } else {
      this.invalidCustom = true;
      this.invalid = true
    }
  }

  onCustomButtonClick() {
    this.tipForm.get('customTipPercentage')?.enable();
    this.invalidCustom = false;
    this.invalid = false;
    this.showCustomTipInput = true;
    this.selectedTipPercentage = 0;
    this.tipPerPerson = 0;
    this.totalPerPerson = 0;
  }

  resetTotal() {
    this.tipPerPerson = 0;
    this.totalPerPerson = 0;
    this.tipForm.reset();
    this.invalid = false;
    this.invalidCustom = false;
  }
}
