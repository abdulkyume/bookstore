import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { BooksService } from 'src/app/core/services/books.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Book } from 'src/app/core/models/book';
import Swal from 'sweetalert2';
import { HighlightDirective } from 'src/app/core/directives/highlight.directive';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HighlightDirective, CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatSidenavModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  color!: string;
  events: string[] = [];
  opened!: boolean;
  booklist!: boolean
  bookForm!: FormGroup;
  private ngUnsubscribe: Subject<any> = new Subject();
  booksForm!: FormGroup;
  allboklist: any = []
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private bookService: BooksService
  ) { }

  ngOnInit(): void {
    this.refreshform();
    window.scrollTo(0, 0)
  }

  togglebooklist() {
    document.getElementById('modal')!.classList.add('hidden');
    this.booklist ? this.booklist = false : this.booklist = true;
    this.getBooklist()
  }

  refreshform() {
    this.bookForm = this.formBuilder.group({
      id: [null],
      title: ["", [Validators.required]],
      author: ["", [Validators.required]]
    })
  }

  get f() {
    return this.bookForm.controls;
  }

  getBooklist() {
    if (this.booklist) {
      this.bookService.getallbooks()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res: any) => {
            this.allboklist = res;
          }
        })
    }
  }

  updateBook(data: Book) {
    this.f['id'].setValue(data.id)
    this.f['title'].setValue(data.title)
    this.f['author'].setValue(data.author)
    this.toggleModal()
  }

  logout() {
    this.authService.logout()
  }

  deleteBook(data: Book) {
    this.bookService.deleteBook(data).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          if (res.id) {
            Swal.fire("Success", "Book Deleted Successfully")

            this.getBooklist()
          }
        },
        error: (err: any) => {
          console.error(err);
        },
        complete: () => { }
      })
  }

  onAddUpdateBooks() {
    if (this.bookForm.invalid) {
      return;
    }
    if (this.f['id'].value) {
      this.bookService.updateBook(this.bookForm.value).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res: any) => {
            if (res.id) {
              Swal.fire("Success", "Book Updated Successfully")
            }
            this.refreshform()
            this.togglebooklist()
          },
          error: (err: any) => {
            console.error(err);
          },
          complete: () => { }
        })

    }
    else {
      this.bookService.addBook(this.bookForm.value).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res: any) => {
            if (res.id) {
              Swal.fire("Success", "Book Updated Successfully")
            }
            this.refreshform()
            this.togglebooklist()
          },
          error: (err: any) => {
            console.error(err);
          },
          complete: () => { }
        })
    }
  }

  toggleModal() {
    document.getElementById('modal')!.classList.toggle('hidden');
    this.booklist = false
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }
}
