import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleComponent } from '@app/components/title/title.component';

@Component({
  selector: 'app-bulk-quotes',
  templateUrl: './bulk-quotes.component.html',
  styleUrls: ['./bulk-quotes.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TitleComponent],
})
export class BulkQuotesComponent {
  api: string =
    'https://www.alphavantage.co/query?function=REALTIME_BULK_QUOTES&symbol=MSFT,AAPL,IBM&apikey=1H3EJGUX0MZAU6FE';

  quotes: any[] = [];
  titles: string[] = ['Symbol', 'Open', 'High', 'Low', 'Close', 'Volume', 'Change (%)'];
  filteredQuotes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(this.api).subscribe(
      (res) => {
        this.quotes = res.data || [];
        this.filteredQuotes = this.quotes;
        console.log('Bulk quotes:', this.quotes);
      },
      (err) => console.error(err)
    );
  }

  
}
