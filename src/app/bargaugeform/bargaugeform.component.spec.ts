import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BargaugeformComponent } from './bargaugeform.component';

describe('BargaugeformComponent', () => {
  let component: BargaugeformComponent;
  let fixture: ComponentFixture<BargaugeformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BargaugeformComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BargaugeformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
