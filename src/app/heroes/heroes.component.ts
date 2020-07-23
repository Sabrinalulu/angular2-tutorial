import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';
import { HeroService } from '../hero.service';
// how to send and display a message each time the user clicks on a hero
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
// When the CLI generated the HeroesComponent, it created an empty heroes.component.css stylesheet for the HeroesComponent and pointed to it in @Component.styleUrls like this.

export class HeroesComponent implements OnInit {

// Rename the component's hero property to selectedHero but don't assign it. There is no selected hero when the application starts.
  // hero : Hero = {
  //   id: 1,
  //   name: "Windstorm"}
  // ;

  // After adding heroservice
  // heroes = HEROES;
  heroes: Hero[];

  // selectedHero: Hero;
  
  // onSelect(hero: Hero): void {
  //   this.selectedHero = hero;
  // }

  // onSelect(hero: Hero): void {
  //   this.selectedHero = hero;
  //   this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  // }

  // When Angular creates a HeroesComponent, the Dependency Injection system sets the heroService parameter to the singleton instance of HeroService
  // constructor(private heroService: HeroService, private messageService: MessageService) { }

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  // Create a method to retrieve the heros from the service
  // This will not work in a real app. The app will fetch heroes from a remote server
  // The method assigns an array of heroes to the component's heroes property
  // The assignment occurs synchronously
  // As if the server could return heroes instantly or the browser could freeze the UI while it waited for the server's response
  // getHeroes(): void {
  //   this.heroes = this.heroService.getHeroes();
  // }

  // The HeroService.getHeroes method used to return a Hero[]. Now it returns an Observable<Hero[]>
  // The new method waits for the Observable to emit the array of heroes—which could happen now or several minutes from now
  // The subscribe() method passes the emitted array to the callback, which sets the component's heroes property
  getHeroes(): void {
    this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    // trim() method removes whitespace from both sides of a string
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  // update the display of list. anticipate that the action will be succeed in the server
  // If you neglect to subscribe(), the service will not send the delete request to the server
  // As a rule, an Observable does nothing until something subscribes
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

}


