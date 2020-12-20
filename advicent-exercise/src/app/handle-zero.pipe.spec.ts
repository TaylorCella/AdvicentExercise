import { HandleZeroPipe } from './handle-zero.pipe';

describe('HandleZeroPipe', () => {
  it('create an instance', () => {
    const pipe = new HandleZeroPipe();
    expect(pipe).toBeTruthy();
  });
});
