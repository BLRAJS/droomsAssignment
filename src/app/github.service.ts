import { Injectable } from '@angular/core';
import { HttpClient } from   '@angular/common/http';
import { throwError, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private http: HttpClient) { }
  private username = 'bradtraversy';
  private client_id = 'd9308aacf8b204d361fd';
  private client_secret='62551cc02cee983fff0bac41baf170eb5a312c1c';
  

  getGithubUsers(pagenum,scrollamount){
    return this.http.get('https://api.github.com/users?since='+pagenum+'?client_id='+this.client_id+'&client_secret='+this.client_secret+"&per_page="+scrollamount).pipe(
      catchError(this.handleError)
    );
  }

  getGithubUsersSearch(term){
    return this.http.get('https://api.github.com/search/users?q='+term).pipe(
    catchError(this.handleError)
    );
 }



  getUserAndRepo(user){
    let response1 = this.http.get('https://api.github.com/users/'+user+'?client_id='+this.client_id+'&client_secret='+this.client_secret);
    let response2 = this.http.get('https://api.github.com/users/'+user+'/repos?client_id='+this.client_id+'&client_secret='+this.client_secret);
    return forkJoin([response1, response2]).pipe(
      catchError(this.handleError)
      );
  }

  private handleError(err) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }


}
