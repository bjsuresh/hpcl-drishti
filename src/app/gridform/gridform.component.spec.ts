import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GridformComponent } from './gridform.component';

describe('GridformComponent', () => {
  let component: GridformComponent;
  let fixture: ComponentFixture<GridformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridformComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GridformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
