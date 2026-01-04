import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FileUploadComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'frontend';
}