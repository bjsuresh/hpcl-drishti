import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QueryformComponent } from './queryform.component';

describe('QueryformComponent', () => {
  let component: QueryformComponent;
  let fixture: ComponentFixture<QueryformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryformComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QueryformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
