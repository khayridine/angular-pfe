import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleComponent } from '@app/components/title/title.component';

@Component({
  selector: 'app-dividendes',
  standalone: true,
  templateUrl: './dividendes.component.html',
  styleUrls: ['./dividendes.component.scss'],
  imports: [CommonModule, FormsModule, TitleComponent],
})
export class DividendesComponent implements OnInit {
  dividends: any[] = [];
  filteredDividends: any[] = [];
  searchText: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDividends();
  }

  fetchDividends(): void {
    const apiKey = 'CDZebzVsyvwAEAkGSa5MiE_TcRLuZW1l';
    const url = `https://api.polygon.io/v3/reference/dividends?apiKey=${apiKey}`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.dividends = data.results || [];
        this.filteredDividends = this.dividends;
      },
      error: (err) => {
        console.error('Erreur de chargement des dividendes', err);
      }
    });
  }

  filterDividends(): void {
    const query = this.searchText.toLowerCase();
    this.filteredDividends = this.dividends.filter(div =>
      div.ticker?.toLowerCase().includes(query)
    );
  }
}
