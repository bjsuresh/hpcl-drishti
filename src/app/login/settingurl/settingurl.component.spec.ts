import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SettingurlComponent } from './settingurl.component';

describe('SettingurlComponent', () => {
  let component: SettingurlComponent;
  let fixture: ComponentFixture<SettingurlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingurlComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingurlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
