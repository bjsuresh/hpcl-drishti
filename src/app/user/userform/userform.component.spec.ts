import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserformComponent } from './userform.component';

describe('UserformComponent', () => {
  let component: UserformComponent;
  let fixture: ComponentFixture<UserformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserformComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
