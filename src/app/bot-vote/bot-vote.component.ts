import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SEOService } from '../services/seo.service';
import { BotsService } from '../services/bots.service';
import { UserService } from '../services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bot-vote',
  templateUrl: './bot-vote.component.html',
  styleUrls: ['./bot-vote.component.css']
})
export class BotVoteComponent implements OnInit {
  bot: any;
  user: any;

  get widgetURL() { return `${environment.endpoint}/bots/${this.id}/widget`; }
  get id() { return this.route.snapshot.paramMap.get('id') }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SEOService,
    private service: BotsService,
    public userService: UserService) {}

  async ngOnInit() {
    await this.service.init();

    this.user = this.service.getBot(this.id);
    this.bot = this.service.getSavedBot(this.id);
    if (!this.user || !this.bot)
      return this.router.navigate(['']);

    this.seo.setTags({
      description: this.bot.listing.overview,
      titlePrefix: `Vote for ${this.user.username}`,
      titleSuffix: 'DBots',
      url: `bots/${this.id}`
    });
  }

  async vote() {
    if (!this.userService.user) return;

    await this.service.vote(this.id);
    await this.service.refreshBots();

    return this.router.navigate(['/bots/' + this.id]);
  }
}
