import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css'],
})
export class LanguageSelectorComponent {
  constructor(private translocoService: TranslocoService) {}
  public languagesList: 
    Array<Record<'imgUrl' | 'code' | 'name' | 'shorthand', string>> = [
    {
      imgUrl: '/assets/flags/English.png',
      code: 'en',
      name: 'English',
      shorthand: 'EN',
    },
    {
      imgUrl: '/assets/flags/French.jpg',
      code: 'fr',
      name: 'Français',
      shorthand: 'FR',
    },
  ];
  public changeLanguage(languageCode: string): void {
    this.translocoService.setActiveLang(languageCode);
  }
}