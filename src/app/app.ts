import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer-component/footer-component';
import { NavbarComponent } from './components/navbar-component/navbar-component';

@Component({
  imports: [RouterOutlet, FooterComponent, NavbarComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('red-social');
}
