import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CirculargaugeformComponent } from './circulargaugeform.component';

describe('CirculargaugeformComponent', () => {
  let component: CirculargaugeformComponent;
  let fixture: ComponentFixture<CirculargaugeformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CirculargaugeformComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CirculargaugeformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
