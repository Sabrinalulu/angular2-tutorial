// Keeping all features in one component as the application grows will not be maintainable.
// moving the hero details into a separate, reusable HeroDetailComponent.
import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { HeroService }  from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})

export class HeroDetailComponent implements OnInit {

  // This component simply receives a hero object through its hero property and displays it
  @Input() hero: Hero;

  constructor(
    // holds information about the route to this instance of the HeroDetailComponent
    private route: ActivatedRoute,
    // gets hero data from the remote server and this component will use it to get the hero-to-display
    private heroService: HeroService,
    // an Angular service for interacting with the browser
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }
  
  getHero(): void {
    // snapshot: static image of the route information after the component is created
    // +: converts the string to number (Route parameter shuld be string)
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  save(): void {
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }
  
  goBack(): void {
    this.location.back();
  }
}
