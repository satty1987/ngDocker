import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSourceComponent } from './new-source.component';

describe('NewSourceComponent', () => {
  let component: NewSourceComponent;
  let fixture: ComponentFixture<NewSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
