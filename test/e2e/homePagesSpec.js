describe('Home Pages', function() {

  var ptor = protractor.getInstance();

  it('should load the homepage', function() {
    ptor.get('/#');
    expect(ptor.findElement(protractor.By.tagName('h1')).getText()).toBe('Your files Recent uploaded csv files');
  });

});
