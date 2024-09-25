import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PagesaveformComponent } from './pagesaveform.component';

describe('PagesaveformComponent', () => {
  let component: PagesaveformComponent;
  let fixture: ComponentFixture<PagesaveformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesaveformComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PagesaveformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
