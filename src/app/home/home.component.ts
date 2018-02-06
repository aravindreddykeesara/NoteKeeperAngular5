import { Component, OnInit } from '@angular/core';
import { Stream } from 'stream';
import {trigger, style, transition, animate, keyframes, query, stagger} from '@angular/animations';
import { CookieService } from 'ngx-cookie-service';
import { Conditional } from '@angular/compiler';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations : [
      trigger('Notes', [
          transition('* => *', [
            query(':enter', style({opacity: 0}), { optional: true}),

            query(':enter', stagger('300ms', [
              animate('.6s ease-in', keyframes([
                 style({opacity: 0, transform: 'translateY(-75%)' , offset: 0}),
                 style({ opacity: .5, transform: 'translateY(35px)', offset: .3 }),
                 style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),

              ]))]), { optional: true}),

            query(':leave', stagger('300ms', [
              animate('.6s ease-in', keyframes([
                style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
                style({ opacity: .5, transform: 'translateY(35px)', offset: .3 }),
                style({ opacity: 0, transform: 'translateY(-75%)', offset: 1 }),

              ]))]), { optional: true })

          ])

      ])
  ]
})
export class HomeComponent implements OnInit {

   itemCount = 0;
   btnText = 'Add a Note';
   NotesText: String = '';
   Notes = [];
   cookieValue = 'UNKNOWN';
   groubedByDates = [];
   dateStoreValues = [];


  constructor(private cookieService: CookieService) {
  }



  ngOnInit() {
    this.Notes = JSON.parse(this.cookieService.get('cookiedataForNotes'));
    this.dateStoreValues = JSON.parse(this.cookieService.get('cookiedataForDates'));
    this.itemCount = this.Notes.length;
    this.groubedByDates = this.groupBy(this.Notes, 'datevalue');
  }

  addItem() {
    const p = new ListObject(this.NotesText, this.formatDate(Date.now()));
    this.Notes.push(p);
    this.dateStoreValues.push(this.formatDate(Date.now()));
    this.dateStoreValues = this.removeDuplicates(this.dateStoreValues);
    // groupby
    this.groubedByDates = this.groupBy(this.Notes, 'datevalue');
    console.log('grouped data' + JSON.stringify(this.groubedByDates));
    this.cookieService.set('cookiedataForNotes', JSON.stringify(this.Notes));
    this.cookieService.set('cookiedataForDates', JSON.stringify(this.dateStoreValues));
    // setting html
    this.NotesText = '';
    this.itemCount = this.Notes.length;
    console.log('Notes value' + JSON.stringify(this.Notes));
  }

  removeItem(indexValue) {
    this.Notes.splice(indexValue, 1);
    this.cookieService.set('cookiedataForNotes', JSON.stringify(this.Notes));
    this.groubedByDates = this.groupBy(this.Notes, 'datevalue');
    this.itemCount = this.Notes.length;
  }

  returnIndexofNote(ClickedNoteValue) {
    for (let indexValue = 0; indexValue < this.Notes.length; indexValue++) {
      const entry = this.Notes[indexValue];
       if (entry.NotesTextValue === ClickedNoteValue) {
         this.removeItem(indexValue);
       }
     }
  }

  deleteAlldata() {
    this.dateStoreValues = [];
    this.Notes = [];
    this.cookieService.deleteAll('cookiedataForDates');
    this.cookieService.deleteAll('cookiedataForNotes');
  }

  formatDate(date) {
  // tslint:disable-next-line:prefer-const
  let d = new Date(date),
    month = '' + (d.getMonth() + 2),
    day = '' + d.getDate(),
    // tslint:disable-next-line:prefer-const
    year = d.getFullYear();

  if (month.length < 2) {month = '0' + month; }
  if (day.length < 2) { day = '0' + day; }

  return [year, month, day].join('-');
}

getTextValue(goatextvalue) {
console.log('goal value clicked' + goatextvalue);
}


  groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  removeDuplicates(datearray) {
    const temp = [];
    for (let i = 0; i < datearray.length; i++) {
      temp[datearray[i]] = true;
    }
    return Object.keys(temp);
  }

}

class ListObject {
  NotesTextValue: any;
  datevalue: any;
    constructor(NotesTextValue, datevalue) {
      this.NotesTextValue = NotesTextValue;
      this.datevalue = datevalue;
    }

}
