import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.css']
})
export class FileUploadComponent implements OnInit {
  selectedFile: File | null = null;
  fileList: any[] = [];
  message: string = '';
  isError: boolean = false;

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.fileService.getFiles().subscribe({
      next: (files) => this.fileList = files,
      error: (err) => console.error('Error loading files', err)
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    this.message = 'מעלה...';
    this.fileService.uploadFile(this.selectedFile).subscribe({
      next: () => {
        this.message = 'איזה יופי! הקובץ נשמר בהצלחה.';
        this.isError = false;
        this.selectedFile = null;
        this.loadFiles(); 
        setTimeout(() => {
          this.message = '';
        }, 3500);
      },
      error: (err) => {
        this.message = 'אופס... שגיאה בהעלאה.';
        this.isError = true;
        setTimeout(() => {
          this.message = '';
        }, 5000);
      }
    });
  }
}