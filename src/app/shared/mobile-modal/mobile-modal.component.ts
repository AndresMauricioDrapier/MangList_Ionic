import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isMobile } from '../validators/isMobile';

@Component({
  selector: 'ml-mobile-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-modal.component.html',
  styleUrls: ['./mobile-modal.component.scss']
})
export class MobileModalComponent implements OnInit{
  isMobile!: boolean;

  ngOnInit(): void {
      this.isMobile = isMobile();
  }

  closeModal(): void {
      const modal = document.getElementById("modal")!;
      modal.style.display = "none";
  }
}
