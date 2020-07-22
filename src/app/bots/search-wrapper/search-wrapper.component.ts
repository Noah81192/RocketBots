import { Component, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
import { BotsComponent } from '../bots.component';
import { Router, ActivatedRoute } from '@angular/router';
import { SEOService as SEOService, TypingSEO } from 'src/app/services/seo.service';
import { BotsService } from '../../services/bots.service';
import { kebabToLowerCase, kebabToTitleCase } from 'src/app/utils';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'search-wrapper',
  templateUrl: './search-wrapper.component.html',
  styleUrls: ['./search-wrapper.component.css']
})
export class SearchWrapperComponent implements AfterViewInit {
  @ViewChild('bots') botsComponent: BotsComponent;
  @ViewChild('searchInput') searchInput: any;

  placeholder = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SEOService,
    public tagService: TagService) {
    this.placeholder = kebabToLowerCase(this.getRandomPlaceholder());
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const query = this.route.snapshot.queryParamMap.get('q');
      if (query)
        this.search(query);

      this.route.paramMap.subscribe(map => {
        const tagName = map.get('tag');
        if (tagName)
          this.searchByTag(tagName);
      });
    });
  }

  getRandomPlaceholder() {
    const i = Math.floor(Math.random() * (this.tagService.tags.length - 1));
    return this.tagService.tags[i].name;
  }

  search(query: string) {
    const extra = (query) ? { queryParams: { q: query } } : {};
    this.router.navigate(['search'], extra);

    this.updateMetaTags({
      description: `Find Discord bots similar to '${query}'.`,
      titleSuffix: `${query} Bots`,
      url: `search/q?=${query}`
    });

    this.botsComponent.search(query);
  }

  searchByTag(name: string) {
    const tag = this.tagService.getTag(name);
    this.botsComponent.setTagLayout(tag);

    this.updateMetaTags({
      description: tag.description,
      titleSuffix: `${kebabToTitleCase(tag.name)} Bots`,
      url: `tags/${tag.name}`
    });
  }

  updateMetaTags(content: TypingSEO) {
    this.seo.setTags(content);
  }
}