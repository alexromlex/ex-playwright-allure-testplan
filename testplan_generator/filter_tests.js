class TestFilter {
    constructor(data) {
        this.tests = data || [];
    }

    filter(filters) {
        if (Array.isArray(filters)) {
            const results = [];
            const seenIds = new Set();
            
            for (const singleFilter of filters) {
                const filtered = this._strictFilter(singleFilter);
                for (const test of filtered) {
                    if (!seenIds.has(test.id)) {
                        seenIds.add(test.id);
                        results.push(test);
                    }
                }
            }
            return results;
        }
        
        return this._strictFilter(filters);
    }
    _strictFilter(filters) {
        if (!filters || typeof filters !== 'object') return [];
        return this.tests.filter(test => this._matchStrict(test, filters));
    }

    _matchStrict(test, filters) {
        for (const [key, value] of Object.entries(filters)) {
            if (key === 'id') {
                // const result = this._evaluate(test.id, value);
                // if (!result) return false;
                if (!this._evaluate(test.id, value)) return false;
                
            } else if (key === 'name') {
                if (!this._evaluate(test.name, value)) return false;
                
            } else if (key === 'group') {
                if (!this._evaluate(test.group, value)) return false;
                
            } else if (key === 'labels') {
                for (const [labelKey, labelCondition] of Object.entries(value)) {
                    let value = null;
                    for (const label of test.labels || []) {
                        if (label.hasOwnProperty(labelKey)) {
                            value = label[labelKey];
                            break;
                        }
                    }
                    
                    if (!this._evaluate(value, labelCondition)) return false;
                }
            } else {
                return false;
            }
        }
        
        return true;
    }

    _evaluate(value, condition) {
        const toStringArray = (v) => {
            if (Array.isArray(v)) return v.map(item => String(item));
            if (v === null || v === undefined) return [];
            return [String(v)];
        };

        const valueItems = toStringArray(value);

        for (const [op, target] of Object.entries(condition)) {
            const targetItems = toStringArray(target);

            switch (op) {
                case 'eq':
                    if (Array.isArray(value) || Array.isArray(target)) {
                        if (!(valueItems.length === targetItems.length && valueItems.every((item, i) => item === targetItems[i]))) return false;
                        break;
                    }
                    if (String(value) !== String(target)) return false;
                    break;
                    
                case 'neq':
                    if (Array.isArray(value) || Array.isArray(target)) {
                        if (valueItems.length === targetItems.length && valueItems.every((item, i) => item === targetItems[i])) return false;
                        break;
                    }
                    if (String(value) === String(target)) return false;
                    break;
                    
                case 'in':
                    if (value === null || value === undefined) return false;
                    if (!valueItems.some(v => targetItems.includes(v))) return false;
                    break;
                    
                case 'nin':
                    if (value === null || value === undefined) break;
                    if (valueItems.some(v => targetItems.includes(v))) return false;
                    break;

                case 'all':
                    if (value === null || value === undefined) return false;
                    if (!targetItems.every(t => valueItems.includes(t))) return false;
                    break;
                    
                case 'exists':
                    if ((value !== null && value !== undefined) !== target) return false;
                    break;
                    
                default:
                    return false;
            }
        }
        return true;
    }

    getUniqueValues(field) {
        const values = new Set();
        
        for (const test of this.tests) {
            if (field === 'epic' || field === 'story' || field === 'severity') {
                for (const label of test.labels || []) {
                    if (label.hasOwnProperty(field)) {
                        values.add(label[field]);
                    }
                }
            } else if (field === 'group') {
                values.add(test.group);
            } else {
                values.add(test[field]);
            }
        }
        
        return values;
    }
}

module.exports = TestFilter;