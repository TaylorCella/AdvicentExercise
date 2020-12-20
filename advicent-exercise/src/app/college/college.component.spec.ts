import { ComponentFixture, TestBed, inject, waitForAsync } from '@angular/core/testing';

import { CollegeComponent } from './college.component';

import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatAutocompleteHarness} from '@angular/material/autocomplete/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {OverlayContainer} from '@angular/cdk/overlay';


describe('CollegeComponent', () => {
  let component: CollegeComponent;
  let fixture: ComponentFixture<CollegeComponent>;
  let overlayContainer: OverlayContainer;
  let loader: HarnessLoader;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollegeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach( () => {
    fixture = TestBed.createComponent(CollegeComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
    })();
  });

  afterEach(() => {
    // Angular won't call this for us so we need to do it ourselves to avoid leaks.
    overlayContainer.ngOnDestroy();
    overlayContainer = null!;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all autocomplete harnesses', async () => {
    const autocompletes = await loader.getAllHarnesses(MatAutocompleteHarness);
    expect(autocompletes.length).toBe(2);
  }
);

  it('should get disabled state', async () => {
    const enabled = await loader.getHarness(MatAutocompleteHarness.with({selector: '#plain'}));
    const disabled = await loader.getHarness(MatAutocompleteHarness.with({selector: '#disabled'}));

    expect(await enabled.isDisabled()).toBe(false);
    expect(await disabled.isDisabled()).toBe(true);
  });

  it('should focus and blur an input', async () => {
    const input = await loader.getHarness(MatAutocompleteHarness.with({selector: '#plain'}));
    expect(await input.isFocused()).toBe(false);
    await input.focus();
    expect(await input.isFocused()).toBe(true);
    await input.blur();
    expect(await input.isFocused()).toBe(false);
  });

  it('should be able to type in an input', async () => {
    const input = await loader.getHarness(MatAutocompleteHarness.with({selector: '#plain'}));
    await input.enterText('Utah');
    expect(await input.getValue()).toBe('Utah');
  });

  it('should be able to get filtered options', async () => {
    const input = await loader.getHarness(MatAutocompleteHarness.with({selector: '#plain'}));
    await input.focus();
    const options = await input.getOptions({text: /Utah/});

    expect(options.length).toBe(1);
    expect(await options[0].getText()).toBe('University of Utah');
  });
});