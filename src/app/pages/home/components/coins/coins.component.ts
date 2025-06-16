import { Component } from '@angular/core';
import { Coin } from '@app/model/coins'; 
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleComponent } from '@app/components/title/title.component';
@Component({
    selector: 'app-coins',
    templateUrl: './coins.component.html',
    styleUrls: ['./coins.component.scss'],
    imports: [CommonModule, FormsModule, TitleComponent],
})
export class CoinsComponent {
    api: string =
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
    coins: Coin[] = [];
    titles: string[] = ['#', 'Coin', 'Price', 'Price Change','total_volume' ]; //'24H Volume'
    searchText: string = '';
    filteredCoints: Coin[] = [];
    constructor(private http: HttpClient) { }



    ngOnInit() {
        this.http.get<Coin[]>(this.api).subscribe(
            (res) => {
                this.coins = res;
                this.filteredCoints = this.coins;
                console.log('result coins', this.coins); 
            },
            (err) => console.error(err)
        );
    }

    searchCoin() {
        this.filteredCoints = this.coins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }
}