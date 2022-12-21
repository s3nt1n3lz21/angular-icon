import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export type IconName = 
'' |
'download' |
'edit' |
'video' |
'info-circle' |
'exclamation-circle' |
'png' |
'minimize' |
'expand' |
'print' |
'sort-alphabetical-ascending' |
'sort-alphabetical-descending' |
'sort-alphabetical-unsorted' |
'sort-numerical-ascending' |
'sort-numerical-descending' |
'sort-numerical-unsorted' |
'filter-inactive' |
'filter-active' |
'chevron-up' |
'chevron-down' |
'chevron-right' |
'chevron-left' |
'chevron-circle-up' |
'chevron-circle-down' |
'chevron-circle-right' |
'chevron-circle-left' |
'question-circle' |
'xls' |
'csv' |
'bin-circle' |
'bin' |
'pdf' |
'person-suit' |
'cross' |
'grid-view' |
'list-view' |
'compass' |
'all-data' |
'selected-data' |
'arrow-curve-right' |
'add-folder' |
'weight' |
'folder' |
'save' |
'save-as' |
'tick-circle' |
'new-window' |
'burger-menu' |
'email' |
'calendar' |
'play' |
'zip' |
'folder-tools' |
'txt' |
'share-link' |
'link-chain' |
'sliders'
;

@Component({
  selector: 'grid-ui-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
/* 
* Custom icon component that uses an <img> tag with an svg data URI which is the fastest way to load an image. By placing it in one component we only have to update it in one place. The colors can also be changed by using some variables.
*/
export class IconComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() public name: IconName = 'info-circle';
  @Input() public noColor = false;
  /*
  * Use an <img> tag with a data URI src attribute by default as this is the fastest way to load images. But if you want to be able to dynamically change the icon colors using CSS variables then use inline instead.
  */
  @Input() public useInlineSVG = false;
  public src: SafeUrl = '';
  private colorIconFillPrimary = '#2671cb';
  private colorIconFillSecondary = '#fff';
  private colorIconFillTertiary = '#002d61';
  private colorIconStrokePrimary = '#2671cb';
  private colorIconStrokeSecondary = '#fff';
  private colorIconBackgroundPrimary = '#e8f0f9';
  private svg = '';

  @ViewChild('icon') public element!: ElementRef;

  public constructor(
    private domSanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    if (!this.name) {
      throw Error('No valid icon name specified');
    }
  }

  public ngAfterViewInit(): void {
    this.updateImage();
  }

  public ngOnChanges(): void {
    this.updateImage();
  }

  public updateImage() {
    if (this.useInlineSVG) {
      return;
    }

    if (!this.element || !this.element.nativeElement) {
      return;
    }

    this.colorIconFillPrimary = getComputedStyle(this.element.nativeElement).getPropertyValue('--color-icon-fill-primary').trim();
    this.colorIconFillSecondary = getComputedStyle(this.element.nativeElement).getPropertyValue('--color-icon-fill-secondary').trim();
    this.colorIconFillTertiary = getComputedStyle(this.element.nativeElement).getPropertyValue('--color-icon-fill-tertiary').trim();
    this.colorIconStrokePrimary = getComputedStyle(this.element.nativeElement).getPropertyValue('--color-icon-stroke-primary').trim();
    this.colorIconStrokeSecondary = getComputedStyle(this.element.nativeElement).getPropertyValue('--color-icon-stroke-secondary').trim();
    this.colorIconBackgroundPrimary = getComputedStyle(this.element.nativeElement).getPropertyValue('--color-icon-background-primary').trim();

    // If we are not using an inline SVG replace the classes with inline styles e.g fill=, stroke= and encode it into the right format to be used in the <img> tag
    const svgHTML: string = this.element.nativeElement.outerHTML;
    let htmlParts: string[] = [];

    // Find the first occurence of e.g. ... class="color-icon-fill-primary color-icon-stroke-primary other-class" ... 
    const classRegex = / class="(.*?)"/;
    let newSvgHTML = svgHTML;
  
    // Replace the class attribute with temporary class name strings
    // e.g. replace ... class="color-icon-fill-primary color-icon-stroke-primary other-class" ...
    //      with    ... color-icon-fill-primary color-icon-stroke-primary ...
    let match = classRegex.exec(svgHTML); // Whole matching string e.g. class="color-icon-fill-primary color-icon-stroke-primary other-class"

    const allOurClassNames = [
      'color-icon-fill-primary',
      'color-icon-fill-secondary',
      'color-icon-fill-tertiary',
      'color-icon-stroke-primary',
      'color-icon-stroke-secondary',
      'color-icon-background-primary'
    ];

    let loopCount = 0;
    const maxLoopCount = 1000;
    while (match && loopCount < maxLoopCount) {
      const allClassNamesPresentAsString = match[1]; // 1st Regex capturing group e.g. color-icon-fill-primary color-icon-stroke-primary other-class
      const allClassNamesPresent = allClassNamesPresentAsString.split(' ');
      const ourPresentClassNames = allClassNamesPresent.filter(x => allOurClassNames.includes(x)); // Only get our class names
      const ourPresentClassNamesAsString = ' ' + ourPresentClassNames.join(' ');

      newSvgHTML = newSvgHTML.replace(classRegex, ourPresentClassNamesAsString); // Now we have ... color-icon-fill-primary color-icon-stroke-primary ...

      match = classRegex.exec(newSvgHTML);
      loopCount += 1;
    }

    // Replace the temporary class name strings with the correct fill and stroke attributes
    // e.g. replace ... color-icon-fill-primary color-icon-stroke-primary ...
    //      with ... fill="#000000" stroke="#000000" ...
    htmlParts = newSvgHTML.split('color-icon-fill-primary');
    for (let index = 0; index < htmlParts.length - 1; index++) {
      htmlParts[index] = htmlParts[index] + 'fill="'+ this.colorIconFillPrimary + '"';
    }
    newSvgHTML = htmlParts.join('');

    htmlParts = newSvgHTML.split('color-icon-fill-secondary');
    for (let index = 0; index < htmlParts.length - 1; index++) {
      htmlParts[index] = htmlParts[index] + 'fill="'+ this.colorIconFillSecondary + '"';
    }
    newSvgHTML = htmlParts.join('');

    htmlParts = newSvgHTML.split('color-icon-fill-tertiary');
    for (let index = 0; index < htmlParts.length - 1; index++) {
      htmlParts[index] = htmlParts[index] + 'fill="'+ this.colorIconFillTertiary + '"';
    }
    newSvgHTML = htmlParts.join('');

    htmlParts = newSvgHTML.split('color-icon-stroke-primary');
    for (let index = 0; index < htmlParts.length - 1; index++) {
      htmlParts[index] = htmlParts[index] + 'stroke="'+ this.colorIconStrokePrimary + '"';
    }
    newSvgHTML = htmlParts.join('');

    htmlParts = newSvgHTML.split('color-icon-stroke-secondary');
    for (let index = 0; index < htmlParts.length - 1; index++) {
      htmlParts[index] = htmlParts[index] + 'stroke="'+ this.colorIconStrokeSecondary + '"';
    }
    newSvgHTML = htmlParts.join('');

    htmlParts = newSvgHTML.split('color-icon-background-primary');
    for (let index = 0; index < htmlParts.length - 1; index++) {
      htmlParts[index] = htmlParts[index] + 'style="background-color:'+ this.colorIconBackgroundPrimary + '"';
    }
    newSvgHTML = htmlParts.join('');

    this.svg = encodeURIComponent(newSvgHTML);
    this.src = this.domSanitizer.bypassSecurityTrustUrl('data:image/svg+xml;utf8,' + this.svg);
    this.cdr.detectChanges();
  }
}
