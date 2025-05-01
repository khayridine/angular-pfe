import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';  


@Component({
    selector: 'app-title',
    templateUrl: './title.component.html',
    styleUrls: ['./title.component.scss'],
    imports: [CommonModule,  ],
})
export class TitleComponent {
    @Input() label: string = '';
    @Input() icon: string = ''; 
} 