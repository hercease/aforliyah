import React, { forwardRef } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

const TypeaheadWithRef = forwardRef((props, ref) => (
  <Typeahead {...props} ref={ref} />
));

TypeaheadWithRef.displayName = 'TypeaheadWithRef';

export default TypeaheadWithRef;
