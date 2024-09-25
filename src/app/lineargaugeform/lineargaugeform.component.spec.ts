import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LineargaugeformComponent } from './lineargaugeform.component';

describe('LineargaugeformComponent', () => {
  let component: LineargaugeformComponent;
  let fixture: ComponentFixture<LineargaugeformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineargaugeformComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LineargaugeformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
