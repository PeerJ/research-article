Polymer({
  attached: function() {
    this.async(this.references);
    this.async(this.figures);
    this.async(this.thumbnails);
    this.async(this.orcid);
    this.async(this.mathjax);
    this.async(this.metrics);
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
    var modal = $('<div id="figure-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-lg"><div class="modal-content"></div></div></div>');

    var content = modal.find('.modal-content').text('Loading…');

    modal.appendTo(document.body).modal({ show: false });

    modal.on('hidden.bs.modal', function() {
        content.html('Loading…');
    });

    $(this).on('click', 'a.figure-link', function() {
        modal.modal('show');
        content.load(this.href + ' figure');
        return false;
    });
  },
  thumbnails: function() {
    var figures = $('.figure-wrap .figure-link').filter(function() {
      return $(this).find('img').length;
    });

    if (!figures.length) {
      return;
    }

    var container = document.createElement('div');
    container.id = 'figure-thumbnails';

    figures.each(function() {
      var link = $(this).clone().addClass('figure-thumbnail').get(0);
      container.appendChild(link);
    });

    this.querySelector('header').appendChild(container);
  },
  orcid: function() {
    var modal = $('<div id="orcid-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog modal-lg"><div class="modal-content"></div></div></div>');

    var content = modal.find('.modal-content').text('Loading…');

    modal.appendTo(document.body).modal({ show: false });

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
  metrics: function() {
    var doi = $('#doi').data('doi');

    if (doi) {
      var container = $('<div/>', { id: 'metrics' }).addClass('hidden-print');

      $('<div/>', {
        'data-badge-type': 'medium-donut',
        'data-badge-details': 'below',
        'data-hide-no-mentions': 'true',
        'data-doi': doi
      }).addClass('altmetric-embed').appendTo(container);

      $('footer').prepend(container);

      this.addScript('https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js');
    }
  },
  addScript: function(src) {
    var script = document.createElement('script');
    script.src = src;
    document.querySelector('head').appendChild(script);
  }
});
