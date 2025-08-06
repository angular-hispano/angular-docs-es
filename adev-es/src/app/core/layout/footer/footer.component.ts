import {signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ExternalLink} from '@angular/docs';
import {RouterLink} from '@angular/router';
import {DISCORD, GITHUB, X} from './../../constants/links';

@Component({
  selector: 'footer[adev-footer]',
  standalone: true,
  imports: [CommonModule, ExternalLink, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly GITHUB = GITHUB;
  readonly X = X;
  readonly DISCORD = DISCORD;
  currentYear = signal(new Date().getFullYear());
}
