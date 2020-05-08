/**
 * Returns the domain name cleared ready to use, with the .rsk suffix and to lowercase.
 * @param domainName the domain name to clear.
 * @returns the cleared domain name
 */
export function cleanDomainName (domainName) {
  const toLowerCaseDomainName = domainName ? domainName.toLowerCase() : domainName;
  const withRskSuffix = (toLowerCaseDomainName && toLowerCaseDomainName.indexOf('.rsk') === -1) ? (toLowerCaseDomainName + '.rsk') : toLowerCaseDomainName;
  return withRskSuffix;
}
