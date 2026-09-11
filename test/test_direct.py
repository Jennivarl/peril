"""
The deployed bundle, run for real in-process by genlayer-test's direct
mode. No chain and no network. Needs conftest.py's Windows patch.
"""

from pathlib import Path

BUNDLE = str(Path(__file__).resolve().parent.parent / "contracts" / "peril_bundle.py")


def test_the_bundle_deploys_with_its_registry(direct_deploy):
    peril = direct_deploy(BUNDLE)
    assert len(peril.covered()) == 7
    assert "cloudflare:www.cloudflarestatus.com" in peril.covered()
    assert peril.count() == 0
