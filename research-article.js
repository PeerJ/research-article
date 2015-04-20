Polymer({
  attached: function() {
    this.doi = $('#doi').data('doi');
    this.async(this.references);
    this.async(this.figures);
    this.async(this.orcid);
    this.async(this.mathjax);
  },
  references: function() {
    var referencesList = $('#references > ul');
    var references = referencesList.find('li');

    var referenceLinks = {};

    references.each(function(i) {
        $(this).find('a[href]').each(function() {
            referenceLinks[this.href] = i;
        });
    });

    // start from the bottom, so the reference list gets re-ordered correctly
    var links = $('section a').get().reverse();

    $(links).each(function() {
        if (typeof referenceLinks[this.href] === 'undefined') {
            return;
        }

        var referenceIndex = referenceLinks[this.href];

        var reference = references.eq(referenceIndex);

        // move the reference to the top of the list
        referencesList.prepend(reference);

        $(this)/*.wrap('<sup/>')*/.popover({
            trigger: 'hover',
            html: true,
            container: 'body',
            content: function() {
                return reference.html();
            }
        });

        /* jshint ignore:start */
        this.elementHeight; // force redraw
        /* jshint ignore:end */
    });
  },
  figures: function() {
    var modal = $(this.$['figure-modal']);

    var content = modal.find('.modal-content').text('Loading…');

    modal.on('hidden.bs.modal', function() {
        content.html('Loading…');
    });

    $(this).on('click', 'a.figure-link', function() {
        modal.modal('show');
        content.load(this.href + ' figure');
        return false;
    });
  },
  orcid: function() {
    var modal = $(this.$['orcid-modal']);

    var content = modal.find('.modal-content').text('Loading…');

    modal.on('hidden.bs.modal', function() {
        content.html('Loading…');
    });

    $('a[data-orcid]').tooltip({
      placement: 'bottom'
    }).on('click', function() {
        modal.modal('show');
        var element = $('<orcid-profile/>').attr('orcid', $(this).data('orcid'));
        content.html(element);
        return false;
    });
  },
  mathjax: function() {
    window.MathJax = {
      messageStyle: 'none',
      'HTML-CSS': {
          linebreaks: { automatic: true },
          scale: 80
      },
      menuSettings: {
          zoom: 'Click'
      },
      elements: this.children
    };

    this.addScript('https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML,Safe');
  },
  addScript: function(src) {
    var script = document.createElement('script');
    script.src = src;
    document.querySelector('head').appendChild(script);
  }
});
