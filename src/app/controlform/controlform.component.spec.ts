import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ControlformComponent } from './controlform.component';

describe('ControlformComponent', () => {
  let component: ControlformComponent;
  let fixture: ComponentFixture<ControlformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlformComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ControlformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
