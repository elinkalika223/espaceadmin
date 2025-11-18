import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private currentPage = new Subject<string>();
  currentPage$ = this.currentPage.asObservable();

  setCurrentPage(page: string) {
    this.currentPage.next(page);
  }
}