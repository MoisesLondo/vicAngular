import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumGeneratorComponent } from './curriculum-generator.component';

describe('CurriculumGeneratorComponent', () => {
  let component: CurriculumGeneratorComponent;
  let fixture: ComponentFixture<CurriculumGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
