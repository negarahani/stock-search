import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchHomeComponent } from './search-home/search-home.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';


const routes: Routes = [
  {path: '', redirectTo: 'search/home', pathMatch: 'full' },
  {path:'search', redirectTo: 'search/home', pathMatch: 'full'}, //this was added recently
  {path:'search/:ticker', component: SearchHomeComponent},
  {path:'watchlist', component: WatchlistComponent},
  {path:'portfolio', component: PortfolioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
