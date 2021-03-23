import { getIdFromIri, getIriFromId } from './iriConverter';

const IRI_PREFIX = 'fake/iri/prefix';

describe('getIdFromIri', () => {
  it('returns null for falsy iri', () => {
    const iri = '';
    const output = getIdFromIri(iri, IRI_PREFIX);
    expect(output).toBe(null);
  });
  it('returns correct id', () => {
    const iri = 'fake/iri/prefix/1';
    const output = getIdFromIri(iri, IRI_PREFIX);
    expect(output).toBe('1');
  });
});
describe('getIriFromId', () => {
  it('returns null for falsy id', () => {
    const id = '';
    const output = getIriFromId(id, IRI_PREFIX);
    expect(output).toBe(null);
  });
  it('returns correct id', () => {
    const id = '1';
    const output = getIriFromId(id, IRI_PREFIX);
    expect(output).toBe('fake/iri/prefix/1');
  });
});
