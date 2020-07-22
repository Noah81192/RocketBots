import { Component, Input, OnInit } from '@angular/core';
import marked from 'marked';
import { UserService } from '../services/user.service';
import { BotsService } from '../services/bots.service';
import { Router } from '@angular/router';
import { TagService } from '../services/tag.service';

@Component({
  selector: 'bot-preview',
  templateUrl: './bot-preview.component.html',
  styleUrls: ['./bot-preview.component.css']
})
export class BotPreviewComponent implements OnInit {
  ownerUser: any;

  @Input() bot = {
    approvedAt: null,
    badges: [],
    listing: {
      body: '',
      githubURL: 'https://github.com/theADAMJR',
      invite: '',
      overview: 'A good bot I guess...',
      prefix: '/',
      tags: ['music', 'moderation', 'utility'],
      websiteURL: 'https://3pg.xyz'
    },
    stats: { guildCount: 100 },
    ownerId: '218459216145285121',
    votes: ['218459216145285121']
  }

  @Input() user = {
    id: '',
    displayAvatarURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
    username: 'Bot User',
    discriminator: '0000'
  }

  get markdown() {
    return marked(this.bot.listing.body, { breaks: true })
      .replace(/<a/g, '<a rel="nofollow" target="_blank" ');
  }

  get canManage() {
    return this.userService.user?.id === this.bot.ownerId;
  }

  constructor(
    public service: BotsService,
    private router: Router,
    public tagService: TagService,
    public userService: UserService) {}

  async ngOnInit() {
    await this.service.init();

    this.ownerUser = await this.userService.getUser(this.bot.ownerId);
  }

  async delete() {
    await this.service.deleteBot(this.user.id);

    this.router.navigate(['/dashboard']);
  }

  async addBadge(name: string) {
    await this.service.addBadge(this.user.id, name);
    await this.service.refreshBots();
  }
}
