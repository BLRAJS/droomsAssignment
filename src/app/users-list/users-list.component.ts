import { Component, OnInit } from '@angular/core';
import { GithubService } from '../github.service';
import { tap, finalize, map ,switchMap, distinctUntilChanged, filter, debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {


//users search
searchForm:FormGroup = this.formBuilder.group({
  searchInput: ["",[Validators.minLength(2),Validators.pattern("^[^@!#$^%&*'-=^^&./,''<>?{})_/|]*$")]],
})
loadingIndicator:boolean=false;
searchAutocomplete:Array<any>;


 //autoscroll pagination
 lastUser: number = 0;  
 usersPerScroll:number=20;
 //in memory data holder
 usersList:Array<any>=[];
 usersListCopy=this.usersList;
 //loader
  usersLoader:boolean=true;


  constructor(private router:Router,private formBuilder: FormBuilder,private route:ActivatedRoute,private githubService:GithubService) { }

  ngOnInit() {
     this.userList(this.lastUser,this.usersPerScroll)
     this.searchOne()
  }

  userList(lastuser,scrollamount){
    this.githubService.getGithubUsers(lastuser,scrollamount).pipe(
      finalize(()=>this.usersLoader=false),
      map(data => Object.keys(data).map(k => data[k]))
     ).subscribe((data)=>{
      this.usersList.push(...data) 
    } )
  }


  searchOne(){

    this.searchForm
    .get('searchInput')
    .valueChanges
    .pipe(
       debounceTime(700), 
       distinctUntilChanged(),
       filter(()=> this.searchForm.valid),
       tap((term)=> { term ?  this.router.navigate(['users'], {queryParams: {s:term} }) : this.router.navigate(['users'])
        })
     )
    .subscribe(dynamicNagivation=>console.log(dynamicNagivation))

   this.route.queryParams.pipe ( 
     switchMap(term  => term.s ? this.githubService.getGithubUsersSearch(term.s) : of({items:[]})),
   ).subscribe((dt) => {
      if(dt['items'].length>0){
        this.searchAutocomplete=dt['items']
        this.usersList=[];
        this.usersList.push(...dt['items'])
      }else{
        this.usersList=this.usersListCopy;
      }
    }
   )
      
  }


  onScroll(){
    this.lastUser=+this.usersList[this.usersList.length - 1].id
    this.userList(this.lastUser,this.usersPerScroll)
    console.log("scroll")
  }

}
