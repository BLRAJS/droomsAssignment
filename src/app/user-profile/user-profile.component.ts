import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap, concat, map } from 'rxjs/operators';
import { GithubService } from '../github.service';
import { combineLatest, forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user:any;
  repos:any;
  username:string;

  constructor(private githubService:GithubService,private route:ActivatedRoute, ) { }

  ngOnInit() {
   this.userDetails()
  }

  userDetails(){
    this.route.paramMap.pipe(
      map( param=> param['params'].id),
      switchMap(param => {
         return this.githubService.getUserAndRepo(param)
        })
    ).subscribe(elem=>
      {
        this.user=elem[0]
        this.repos=elem[1]
      }
      )
  }



}
