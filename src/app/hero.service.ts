// ng generate service hero
// The command generates a skeleton HeroService class
import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
// simulate getting data from the remote server
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
// All HttpClient methods return an RxJS Observable of something
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

// This marks the class as one that participates in the dependency injection system. 
// The HeroService class is going to provide an injectable service, and it can also have its own injected dependencies.
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  // Define the heroesUrl of the form :base/:collectionName with the address of the heroes resource on the server
  // base is the resource to which requests are made, and collectionName is the heroes data object in the in-memory-data-service.ts
  private heroesUrl = 'api/heroes';  // URL to web api

  // getHeroes(): Hero[] {
  //   return HEROES;
  // }

  // remote server mode (add service)
  // getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
  //   this.messageService.add('HeroService: fetched heroes');
  //   return of(HEROES);
  // }

  // present the data of hero details, using navigation
  // getHero(id: number): Observable<Hero> {
    // TODO: send the message _after_ fetching the hero
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    // get hero item with ID=?
  //   return of(HEROES.find(hero => hero.id === id));
  // }

  /** (For server) GET hero by id. Will 404 if id not found */ 
  getHero(id: number): Observable<Hero> {
    // constructs a request URL with the desired hero's id
    const url = `${this.heroesUrl}/${id}`;
    // returns an Observable<Hero> ("an observable of Hero objects") rather than an observable of hero arrays 
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** GET heroes from the server */
  // an observable can return multiple values over time. An observable from HttpClient always emits a single value
  // HttpClient.get() call returns an Observable<Hero[]>; that is, "an observable of hero arrays"
  // In practice, it will only return a single hero array
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      // tap(): looks at the observable values, does something with those values, and passes them along. The tap() call back doesn't touch the values themselves
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  // Angular will inject the singleton MessageService into that property when it creates the HeroService
  // This is a typical "service-in-service" scenario: you inject the MessageService into the HeroService which is injected into the HeroesComponent
  constructor(private http: HttpClient, private messageService: MessageService) { }

  // Notice that you keep injecting the MessageService but since you'll call it so frequently, wrap it in a private log() method:
  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    // http.put() to persist the changed hero on the server; takes 3 parameter: the URL, data to update (ex. modified hero), options
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  // The heroes web API expects a special header in HTTP save requests. That header is in the httpOptions constant defined in the HeroService
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /** POST: add a new hero to the server */
  // It expects the server to generate an id for the new hero, which it returns in the Observable<Hero> to the caller
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
      
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }

}
