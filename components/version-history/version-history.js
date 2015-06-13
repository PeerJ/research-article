Polymer({
  github: '',
  url: '',
  releasesChanged: function() {
    // TODO: radio inputs aren't updating when these are set
    this.versionTo = this.releases[0].tag_name;

    if (this.releases.length > 1) {
      this.versionFrom = this.releases[1].tag_name;
    }
  },
  date: function(input, format) {
    var date = new Date(input),
      day = date.getDate(),
      month = date.getMonth() + 1,
      year = date.getFullYear();

    return format
      .replace('yyyy', year.toString())
      .replace('mm', month.toString().replace(/^(\d)$/, '0$1'))
      .replace('dd', day.toString().replace(/^(\d)$/, '0$1'));
  }
});
