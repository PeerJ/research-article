Polymer({
  attached: function() {
    this.async(this.references);
    this.async(this.figures);
    this.async(this.orcid);
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
    var links = $('#main a').get().reverse();

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

    $('a.figure-link').on('click', function() {
        modal.modal('show');
        content.load(this.href + ' figure');
        return false;
    });
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
  }
});
