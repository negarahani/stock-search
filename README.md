# Stock Search Angular Application

## Overview
This project is a stock search application built using Angular, Node.js, AJAX, and JSON technologies, with a focus on creating a responsive design using HTML5 and Bootstrap. The backend is powered by Node.js hosted on cloud services (GA/AWS/Azure), and data is managed using MongoDB Atlas. It is a single-page application (SPA) that primarily operates on a single HTML page, with content dynamically loaded and updated using Angular, without requiring full page reloads.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.3.

## Key Features
- **AJAX and JSON**: Utilize AJAX for asynchronous data retrieval and JSON for data interchange.
- **Responsive Design**: Enhance user experience with responsive design principles using HTML5, Bootstrap, and Angular.
- **API Integration**: Leverage popular APIs including Finnhub, Polygon.io, and Highcharts for stock data and visualizations.
- **Cloud Hosting**: Deploy backend services on cloud platforms like Google App Engine, AWS, or Azure.
- **MongoDB Atlas**: Manage and access stock data and user information using MongoDB Atlas.

## Functionality
- **Stock Search**: Search for stock tickers using the Finnhub API with an autocomplete feature. Results include stock details such as price, changes, and company information.
- **Watchlist**: Users can add stocks to a watchlist stored in MongoDB Atlas. Stocks in the watchlist are color-coded based on price changes and are easily removable.
- **Portfolio Management**: Simulate real-world trading with a portfolio feature. Users can buy and sell stocks, track their investments, and manage a virtual wallet initialized with $25,000.

## Navigation and Routes
- **Home**: Default route redirecting to the search page.
- **Search Details**: Displays detailed information for a selected stock ticker.
- **Watchlist**: Shows the user’s watchlist of stocks.
- **Portfolio**: Displays the user's portfolio with real-time updates on stock prices and total investment value.

## Technical Highlights
- **Frontend**: Built with Angular and Bootstrap, featuring responsive and dynamic user interfaces.
- **Backend**: Powered by Node.js with Express, handling API requests and data processing.
- **Cloud Deployment**: Application is hosted on cloud services ensuring scalability and reliability.
- **Data Management**: Uses MongoDB Atlas for handling stock data, watchlists, and portfolio management.

## Development Instructions

### Development Server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code Scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running Unit Tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running End-to-End Tests
Run `ng e2e` to execute end-to-end tests with [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
