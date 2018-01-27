import { Component, OnInit } from '@angular/core';
import { Stream } from 'stream';
import {trigger, style, transition, animate, keyframes, query, stagger} from '@angular/animations';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations : [
      trigger('goals', [
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

   itemCount = 4;
   btnText = 'Add a item';
   goalText: String = 'task for today';
   goals = [];
   cookieValue = 'UNKNOWN';

  constructor(private cookieService: CookieService) { }



  ngOnInit() {
    this.goals = JSON.parse(this.cookieService.get('cookiedata'));
    this.itemCount = this.goals.length;
  }

  addItem() {
    const p = new ListObject(this.goalText, 'sampleValue');
    this.goals.push(p);
    this.cookieService.set('cookiedata', JSON.stringify(this.goals));
    this.goalText = '';
    this.itemCount = this.goals.length;
    console.log('goals value' + this.goals);
  }

  removeItem(i) {
    this.goals.splice(i, 1);
    this.cookieService.set('cookiedata', JSON.stringify(this.goals));
    this.itemCount = this.goals.length;
  }

}

class ListObject {
  goalTextValue: any;
  datevalue: any;
    constructor(goalTextValue, datevalue) {
      this.goalTextValue = goalTextValue;
      this.datevalue = datevalue;
    }

}
