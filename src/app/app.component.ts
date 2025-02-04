import { Component } from '@angular/core';
import { CurriculumGeneratorComponent } from './curriculum-generator/curriculum-generator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CurriculumGeneratorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'victor-Angular';
}
